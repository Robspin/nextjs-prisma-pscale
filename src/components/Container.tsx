const Container = (props: any) => {
    const { children } = props

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {children}
        </div>
    )
}

export default Container