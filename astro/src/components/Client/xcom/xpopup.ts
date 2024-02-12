const XPopup = ({
    content,
}: {
    content: string
}) => {
    const tweetext = encodeURIComponent(content)
    window.open(
        `https://twitter.com/intent/tweet?text=${tweetext}`, '_blank', '')
}

export default XPopup