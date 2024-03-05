import { memo, useState, useContext, Dispatch, SetStateAction } from "react"
import { Session_context } from "../common/contexts"
import { type msgInfo, type modes, type popupContent } from "../common/types"
import { servicename , pagesPrefix } from "@/utils/vars"

import {
    buildRecordBase,
    attachImageToRecord,
    attachExternalToRecord,
    type SessionNecessary
} from "@/utils/recordBuilder";

import createRecord from "@/utils/atproto_api/createRecord";
import createPage from "@/utils/backend_api/createPage";
import { label } from "@/utils/atproto_api/labels";
import { setSavedTags, readSavedTags } from "@/utils/localstorage";

import { link } from "../common/tailwind_variants";

import Tweetbox from "../common/Tweetbox"
import ImgForm from "./ImgForm"
import ImgViewBox from "./imgctrl/ImgViewBox"
import TextForm from "./TextForm"
import Popup from "../intents/popup"
import AutoXPopupToggle from "./options/AutoXPopupToggle"
import NoGenerateToggle from "./options/NoGenerateToggle"
import ShowTaittsuuToggle from "./options/ShowTaittsuuToggle"
import ForceIntentToggle from "./options/ForceIntentToggle"
import AppendVia from "./options/AppendViaToggle"
import PostButton from "./PostButton"
import LanguageSelect from "./LanguageSelect"
import Details from "./Details"
import TagInputList from "./TagInputList"
import SelfLabelsSelector from "./SelfLabelsSelect"

import { useKey } from "react-use"
import type { KeyPredicate } from "react-use/lib/useKey"

const MemoImgViewBox = memo(ImgViewBox)
const Component = ({
    setMsgInfo,
    processing,
    setProcessing,
    setMode,
    setPopupContent
}: {
    processing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    setMode: Dispatch<SetStateAction<modes>>,
    setPopupContent: Dispatch<SetStateAction<popupContent>>,
}) => {
    const siteurl = location.origin

    /** Apple製品利用者の可能性がある場合True */
    const isAssumedAsAppleProdUser = navigator.userAgent.toLowerCase().includes("mac os x")

    // ImgFormにて格納されるimageとディスパッチャー
    const [imageFiles, setImageFile] = useState<Array<File>>([]);
    // ImgFormにて格納されるAltテキストのリスト
    const [altTexts, setAltText] = useState<Array<string>>(["", "", "", ""]);
    // Post内容を格納する変数とディスパッチャー
    const [post, setPost] = useState<string>("")
    // Postの文字数を格納する変数とディスパッチャー
    const [count, setCount] = useState<number>(0)
    // Postの実行状態を管理する変数とディスパッチャー
    const [isPostProcessing, setPostProcessing] = useState<boolean>(false)
    // Postの実行状態を管理する変数とディスパッチャー
    const [language, setLanguage] = useState<Array<string>>(["ja"])
    // セッション
    const { session } = useContext(Session_context)
    // Postの入力上限
    const countMax = 300
    // PostのWarining上限
    const countWarn = 140
    // 保存できるタグの上限
    const maxTagCount = 8
    // Options
    // ポスト時に自動でXを開く
    const [autoPop, setAutoPop] = useState<boolean>(false)
    // OGP画像を生成しない（Embedを有効にする）
    const [noGenerate, setNoGenerate] = useState<boolean>(false)
    // OGP画像を生成しない（Embedを有効にする）
    const [noUseXApp, setNoUseXApp] = useState<boolean>(false)
    // タイッツーボタンを表示する
    const [showTaittsuu, setShowTaittsuu] = useState<boolean>(false)
    // メディアに対してラベル付与を行う
    const [selfLabel, setSelfLabel] = useState<label.value | null>(null)
    // viaを付与する
    const [appendVia, setAppendVia] = useState<boolean>(false)

    const handlePost = async () => {
        if (!isValidPost()) {
            return
        }

        const initializePost = () => {
            setPostProcessing(true)
            setProcessing(true)
            // Postを押したら強制的にフォーカスアウトイベントを発火
        }
        initializePost()
        setMsgInfo({
            msg: "レコードに変換中...",
            isError: false
        })
        try {
            let record = await buildRecordBase({
                text: post,
                createdAt: new Date(),
                langs: language,
                $type: "app.bsky.feed.post",
                labels: (selfLabel !== null) ? {
                    $type: "com.atproto.label.defs#selfLabels",
                    values: [selfLabel]
                } : undefined,
                via: (appendVia !== false) ? servicename : undefined
            })
            // Hashtagが含まれている場合はブラウザに保存
            const savedTag = readSavedTags()
            let taglist: string[] = (savedTag !== null) ? savedTag : []
            record.facets?.forEach((value) => {
                const facet = value.features[0]
                if (facet.$type === "app.bsky.richtext.facet#tag") {
                    const tagName = `#${facet.tag}`
                    const tagIndex = taglist.indexOf(tagName)
                    if (tagIndex < 0) {
                        // タグが存在しない場合は先頭に追加
                        taglist.unshift(tagName)
                    } else {
                        // タグが存在する場合は先頭に移動
                        taglist.splice(tagIndex, 1)
                        taglist.unshift(tagName)
                    }
                }
            })
            setSavedTags(taglist.slice(0, maxTagCount))

            let popupContent: popupContent = {
                url: null,
                content: post
            }
            // ボタンはログインしている前提で表示される
            if (session.accessJwt === null || session.did === null) {
                let e: Error = new Error("フロントエンドが想定していない操作が行われました。")
                e.name = "Unexpected Error@postform.tsx"
                throw e
            }
            const sessionNecessary: SessionNecessary = {
                did: session.did,
                accessJwt: session.accessJwt,
            }
            // 文字数が制限数を超えていた場合は終了
            if (count > countMax) {
                let e: Error = new Error("文字数制限を超えています。")
                e.name = "postform.tsx"
                throw e
            }
            const noImagesAttached = (imageFiles.length <= 0)
            // 画像のアップロードを行う場合の処理(Bluesky側)
            if (!noImagesAttached) {
                record = await attachImageToRecord({
                    base: record,
                    session: sessionNecessary,
                    imageFiles: imageFiles,
                    handleProcessing: setMsgInfo,
                    altTexts: altTexts
                })
            }
            if (typeof record.facets !== "undefined" && record.facets.length > 0) {
                let linkcardUrl: string | null = null
                // メンションではなくリンクを検出する
                record.facets.forEach((value) => {
                    const facetObj = value.features[0]
                    if (facetObj.$type === "app.bsky.richtext.facet#link") {
                        linkcardUrl = facetObj.uri
                    }
                })
                if (linkcardUrl !== null) {
                    popupContent.url = new URL(linkcardUrl)
                }
                if (linkcardUrl !== null) {
                    // OGPを生成する必要がない場合(!noGenerate but noImageAttached)
                    // またはOGPの生成を抑制している場合(noGenerate)で
                    // 外部リンクが添付されている場合はlinkcardを付与する
                    if (noGenerate || noImagesAttached) {
                        record = await attachExternalToRecord({
                            apiUrl: siteurl,
                            base: record,
                            session: sessionNecessary,
                            externalUrl: new URL(linkcardUrl),
                            handleProcessing: setMsgInfo
                        })
                    }
                }
            }
            setMsgInfo({
                msg: "Blueskyへポスト中...",
                isError: false
            })
            const rec_res = await createRecord({
                repo: session.did,
                accessJwt: session.accessJwt,
                record: record,
            })
            if (typeof rec_res?.error !== "undefined") {
                let e: Error = new Error(rec_res.message)
                e.name = rec_res.error
                throw e
            }
            setMsgInfo({
                msg: "Blueskyへポストしました!",
                isError: false
            })
            // noGenerateの場合はTwitter用ページは生成しない
            if (!noGenerate && !noImagesAttached) {
                setMsgInfo({
                    msg: "Twitter用ページ生成中...",
                    isError: false
                })
                const get_res = await createPage({
                    accessJwt: session.accessJwt,
                    uri: rec_res.uri
                })
                if (typeof get_res?.error !== "undefined") {
                    let e: Error = new Error(get_res.message)
                    e.name = `pstform.tsx ${get_res.error}`
                    throw e
                }
                setMsgInfo({
                    msg: "Twitter用リンクを生成しました!",
                    isError: false
                })
                const [id, rkey] = get_res.uri.split("/")
                const ogpUrl = new URL(`${pagesPrefix}/${id}@${rkey}/`, siteurl)
                popupContent.url = ogpUrl
                popupContent.content += `${popupContent.content !== "" ? ("\n") : ("")}${ogpUrl.toString()}`
            }
            if (autoPop) {
                Popup({
                    intentKind: "xcom",
                    content: popupContent.content
                })
            }
            setPopupContent(popupContent)
            setMode("xcom")
            handlerCancel()
        } catch (error: unknown) {
            let msg: string = "Unexpected Unknown Error"
            if (error instanceof Error) {
                msg = error.name + ": " + error.message
            }
            setMsgInfo({
                msg: msg,
                isError: true
            })
        }
        setProcessing(false)
        setPostProcessing(false)
    }
    const handlerCancel = () => {
        setImageFile([])
        setPost("")
        setCount(0)
    }
    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPost(event.target.value)
        try {
            const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
            const segments = segmenterJa.segment(event.currentTarget.value)
            setCount(Array.from(segments).length)
        } catch (e) {
            // Intl.Segmenterがfirefoxでは未対応であるため、やむをえずレガシーな方法で対処
            // 絵文字のカウント数が想定より多く設定されてしまうため、firefox_v125までは非推奨ブラウザとする
            setCount(event.currentTarget.value.length)
        }
    }

    /**
     * Ctrl+Enterが押されたかどうかを判定します
     * @param e キーボードイベント
     * @returns Ctrl+Enterが押された場合true
     */
    const isCtrlEnterPressed: KeyPredicate = (e) => {
        if (e.key === "Enter") {
            if (isAssumedAsAppleProdUser) {
                return e.metaKey === true
            }
            return e.ctrlKey === true
        }
        return false
    }

    // Ctrl+Enterが押された場合に投稿する
    useKey(isCtrlEnterPressed, () => {
        handlePost().catch((e: unknown) => {
            const msg: string =
                e instanceof Error
                    ? `${e.name}: ${e.message}`
                    : "Unexpected Error@PostForm.tsx"
            setMsgInfo({
                msg: msg,
                isError: true,
            })
        })
    })

    /**
     * ポスト可能かどうかを判定します
     * @returns ポスト可能な場合true
     */
    const isValidPost = () => post.length >= 1 || imageFiles.length > 0

    return (
        <>
            <Tweetbox>
                <div className="flex">
                    <button
                        onClick={handlerCancel}
                        className={link({
                            enabled: isValidPost(),
                            class: ["inline-block", "mx-2", "flex-none"]
                        })}
                        disabled={!isValidPost()}>
                        下書きを消す
                    </button>
                    <div className="flex-1"></div>
                    <SelfLabelsSelector
                        disabled={processing}
                        setSelfLabel={setSelfLabel}
                        selectedLabel={selfLabel} />
                    <div className="flex-none my-auto">
                        <PostButton
                            handlePost={handlePost}
                            isProcessing={processing}
                            isPostProcessing={isPostProcessing}
                            disabled={!isValidPost()} />
                    </div>
                </div>
                <TextForm
                    post={post}
                    disabled={isPostProcessing}
                    onChange={handleOnChange} />
                <div className="flex">
                    <ImgForm
                        disabled={isPostProcessing}
                        imageFiles={imageFiles}
                        setImageFile={setImageFile}
                        className="py-0"
                    />
                    <div className="flex-1 my-auto"></div>
                    <LanguageSelect
                        disabled={isPostProcessing}
                        setLanguage={setLanguage} />
                    <div className={
                        `align-middle my-auto mr-1 px-2 flex-none w-20 rounded-lg ${(
                            count > countMax
                        ) && "bg-red-300"
                        } ${(
                            count > countWarn && count <= countMax
                        ) && "bg-amber-300"
                        }`}>
                        {count}/{countMax}
                    </div>
                </div>
                <div className="mx-2 my-auto">
                    <div className="flex w-full">
                        <div className="flex-none my-auto">よく使うタグ: </div>
                        <TagInputList
                            post={post}
                            setPost={setPost}
                            disabled={processing} />
                    </div>

                    <div className="flex flex-wrap mb-4">
                        <AutoXPopupToggle
                            labeltext={"Xを自動で開く"}
                            prop={autoPop}
                            setProp={setAutoPop} />
                        <NoGenerateToggle
                            labeltext={"Xへの画像は自身で添付する"}
                            prop={noGenerate}
                            setProp={setNoGenerate} />
                    </div>
                </div>
                <MemoImgViewBox
                    imageFiles={imageFiles}
                    setImageFile={setImageFile}
                    altTexts={altTexts}
                    setAltText={setAltText} />
                <div className="mx-2 my-auto">
                    <Details initHidden={!(showTaittsuu || noUseXApp || appendVia)}>
                        <div className="flex flex-wrap">
                            <ShowTaittsuuToggle
                                labeltext={"タイッツーの投稿ボタンも表示する"}
                                prop={showTaittsuu}
                                setProp={setShowTaittsuu} />
                            <ForceIntentToggle
                                labeltext={"Xの投稿はアプリを強制的に起動する"}
                                prop={noUseXApp}
                                setProp={setNoUseXApp} />
                            <AppendVia
                                labeltext={"Viaを付与する"}
                                prop={appendVia}
                                setProp={setAppendVia} />
                        </div>
                    </Details>
                </div>
            </Tweetbox>
        </>
    );
}

export default Component