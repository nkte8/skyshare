
import ProcButton from "../common/ProcButton"

export const Component = ({
    handlePost,
    isProcessing,
    isPostProcessing,
    disabled,
}: {
    handlePost: () => void,
    isProcessing: boolean,
    isPostProcessing: boolean,
    disabled: boolean
}) => {
    return (
        <ProcButton
            handler={handlePost}
            isProcessing={isProcessing}
            context="Post"
            showAnimation={isPostProcessing}
            color="blue"
            className={["my-0","py-0.5"].join(" ")}
            disabled={disabled} />
    )
}
export default Component