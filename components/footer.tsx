const Footer = () => {
    return (
        <footer className="bg-white border-t">
            <div className="py-10 mx-auto">
                <p className="text-xs text-center text-black">
                    &copy; {new Date().getFullYear()} FakeStoreName, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer;