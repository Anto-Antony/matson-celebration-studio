const scrollToElement = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

export default scrollToElement;
