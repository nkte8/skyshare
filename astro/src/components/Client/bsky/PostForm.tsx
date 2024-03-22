import { memo, useState, Dispatch, SetStateAction } from "react"
import { type msgInfo, type modes, MediaData } from "../common/types"

import { label } from "@/utils/atproto_api/labels";
import { link } from "../common/tailwindVariants";

import Tweetbox from "../common/Tweetbox"
import TextForm from "./unique/TextInputBox"
import callPopup from "../intents/callPopup"
import AutoXPopupToggle from "./optionToggles/AutoXPopupToggle"
import NoGenerateToggle from "./optionToggles/NoGenerateToggle"
import ShowTaittsuuToggle from "./optionToggles/ShowTaittsuuToggle"
import ForceIntentToggle from "./optionToggles/ForceIntentToggle"
import AppendVia from "./optionToggles/AppendViaToggle"
import LanguageSelectList from "./selectLists/LanguageSelectList"
import Details from "../common/Details"
import TagInputList from "./unique/TagInputList"
import SelfLabelsSelectList from "./selectLists/SelfLabelsSelectList"
import LinkcardAttachButton from "./buttons/LinkcardAttachButton"
import PostButton from "./buttons/PostButton"
import AddImageButton from "./buttons/AddImageButton"
import twitterText from 'twitter-text';

import MediaPreview from "./MediaPreview"

import { popupPreviewOptions } from "../intents/types";

const MemoMediaPreview = memo(MediaPreview)

export type callbackPostOptions = {
    postText: string,
    previewTitle: string | null
    previewData: Blob | null
}

export type callbackTextInputBoxOptions = {
    postText: string,
}

const Component = ({
    setMsgInfo,
    isProcessing,
    setProcessing,
    setMode,
    mediaData,
    setMediaData,
    setPopupPreviewOptions,
}: {
    setMsgInfo: Dispatch<SetStateAction<msgInfo>>,
    isProcessing: boolean,
    setProcessing: Dispatch<SetStateAction<boolean>>,
    setMode: Dispatch<SetStateAction<modes>>,
    mediaData: MediaData,
    setMediaData: Dispatch<SetStateAction<MediaData>>,
    setPopupPreviewOptions: Dispatch<SetStateAction<popupPreviewOptions>>,
}) => {
    // Post内容を格納する変数とディスパッチャー
    const [postText, setPostText] = useState<string>("")
    // Postの文字数を格納する変数とディスパッチャー
    const [count, setCount] = useState<number>(0)
    // Postの実行状態を管理する変数とディスパッチャー
    const [language, setLanguage] = useState<string>("ja")
    // Postの入力上限 (Bsky)
    const countMax = 300
    // PostのWarining上限
    const countWarn = 140
    // Postの入力上限 (X)
    const countMaxX = 140
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

    /**
     * 投稿リセット（下書きを削除）ボタンを押した際の動作
     */
    const handlerCancel = () => {
        setMediaData(null)
        setPostText("")
        setCount(0)
    }

    /**
     * PostButtonコンポーネントのcallback関数
     * @param options callback元から取得したいオプション
     */
    const callbackPost = (options: callbackPostOptions
    ) => {
        if (autoPop) {
            callPopup({
                postText: options.postText,
                kind: "xcom"
            })
        }
        const mediaObjectURL: string | null = options.previewData ? (
            URL.createObjectURL(options.previewData)
        ) : (null)
        const popupPreviewOptions: popupPreviewOptions = {
            postText: options.postText,
            mediaObjectURL: mediaObjectURL,
            ogpTitle: options.previewTitle
        }
        setPopupPreviewOptions(popupPreviewOptions)
        setMode("xcom")
        handlerCancel()
    }

    /**
     * TextInputBoxコンポーネントのcallback関数
     * @param options callback元から取得したいオプション
     */
    const callbackTextImputBox = (options: callbackTextInputBoxOptions) => {
        setPostText(options.postText)
        try {
            const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
            const segments = segmenterJa.segment(options.postText)
            setCount(Array.from(segments).length)
        } catch (e) {
            // Intl.Segmenterがfirefoxでは未対応であるため、やむをえずレガシーな方法で対処
            // 絵文字のカウント数が想定より多く設定されてしまうため、firefox_v125までは非推奨ブラウザとする
            setCount(options.postText.length)
        }
    }

    /**
     * ポスト可能かどうかを判定します
     * @returns ポスト可能な場合true
     */
    const isValidPost = () => postText.length >= 1 || (
        mediaData !== null && mediaData.images.length > 0)

    /**
     * X での文字数カウントを返します
     * @returns 文字数
     */
    const textCountOnX = (): number => {
        return twitterText.parseTweet(postText).weightedLength / 2
    }

    return (
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
                <SelfLabelsSelectList
                    disabled={isProcessing}
                    setSelfLabel={setSelfLabel}
                    selectedLabel={selfLabel} />
                <div className="flex-none my-auto">
                    <PostButton
                        postText={postText}
                        language={language}
                        selfLabel={selfLabel}
                        options={{
                            noGenerateOgp: noGenerate,
                            appendVia: appendVia
                        }}
                        mediaData={mediaData}
                        callback={callbackPost}
                        isProcessing={isProcessing}
                        setProcessing={setProcessing}
                        setMsgInfo={setMsgInfo}
                        disabled={!isValidPost()} />
                </div>
            </div>
            <TextForm
                postText={postText}
                mediaData={mediaData}
                setMediaData={setMediaData}
                callback={callbackTextImputBox}
                disabled={isProcessing}
            >
                {/* テキスト数の表示 コンポーネント化したい */}
                <div className={
                    `rounded-lg opacity-75 text-sm px-2 ${(
                        count > countMax
                    ) && "bg-red-300"
                    } ${(
                        count > countWarn && count <= countMax
                    ) && "bg-amber-300"
                    }`}>
                    <span>{textCountOnX()}/{countMaxX} {' (X)'}</span>
                    <span className="ml-2">{count}/{countMax}</span>
                    {` (Bluesky)`}
                </div>
            </TextForm>
            <LinkcardAttachButton
                postText={postText}
                setMediaData={setMediaData}
                isProcessing={isProcessing}
                setProcessing={setProcessing}
                setMsgInfo={setMsgInfo}
            />
            <div className="flex">
                <AddImageButton
                    disabled={isProcessing}
                    mediaData={mediaData}
                    setMediaData={setMediaData}
                />
                <div className="flex-1 my-auto"></div>
                <LanguageSelectList
                    disabled={isProcessing}
                    setLanguage={setLanguage} />
            </div>
            <div className="mx-2 my-auto">
                <div className="flex w-full">
                    <div className="flex-none my-auto">よく使うタグ: </div>
                    <TagInputList
                        postText={postText}
                        setPostText={setPostText}
                        disabled={isProcessing} />
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
            <MemoMediaPreview
                mediaData={mediaData}
                setMediaData={setMediaData}
            />
            <div className="mx-2 my-auto">
                <Details
                    summaryLabel="実験的な機能"
                    initHidden={!(showTaittsuu || noUseXApp || appendVia)}>
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
    );
}

export default Component