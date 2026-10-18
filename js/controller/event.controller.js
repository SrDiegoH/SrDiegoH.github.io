class EventController {
    #parameterService;
    #pageLoaderService;
    #tagService;

    #isMenuOpen;

    constructor(parameterService, pageLoaderService, tagService){
        this.#parameterService = parameterService;
        this.#pageLoaderService = pageLoaderService;
        this.#tagService = tagService;

        this.#isMenuOpen = false;
    }

    #translate = (text) => translate(this.#parameterService.getShouldTranslate(), text);

    openAndCloseMenu(event) {
        const menuIcon = event.target;

        const menu = document.getElementById("menu");

        if(this.#isMenuOpen) {
            menuIcon.src = `${AppConfig.ASSETS_BASE_URL}%2B_icon.png`;
            menu.style.visibility="hidden";

            this.#tagService.closeTags();
        } else {
            menuIcon.src = `${AppConfig.ASSETS_BASE_URL}x_icon.png`;
            menu.style.visibility="visible";

            this.#loadLanguage();
        }

        this.#isMenuOpen = !this.#isMenuOpen;
    }

    #loadLanguage(){
        document.getElementById("translate_button").checked = this.#parameterService.getShouldTranslate();
        this.#changeTranslationOnPage();
    }

    changeTranslation(event){
        this.#parameterService.setShouldTranslate(event.target.checked);

        this.#changeTranslationOnPage();

        this.#tagService.loadTagsText();

        this.#pageLoaderService.loadPage();

        this.#syncUrlParams();
    }

    #changeTranslationOnPage(){
        const iconName = this.#parameterService.getShouldTranslate()? "BRL" : "USA";
        document.getElementById("translate_icon").src = `${AppConfig.ASSETS_BASE_URL}${iconName}_icon.png`;
    }

    copyLinkToClipboard(){
        let urlWithParameters = this.#buildUrlWithParameters(window.location);

        const shareIconTooltip = document.getElementById("share_icon_tooltip");

        navigator.clipboard
                 .writeText(urlWithParameters)
                 .then(() => this.#clipboardFallback(shareIconTooltip, "Copiado!", AppConfig.DEFAULT_COLOR),
                       () => this.#clipboardFallback(shareIconTooltip, "Erro!", AppConfig.ERROR_COLOR));
    }

    #buildUrlWithParameters(baseUrl){
        const language = `shouldTranslate=${this.#parameterService.getShouldTranslate()}`;
        const color = `color=${this.#parameterService.getColor().replace("#", "")}`;
        const tags = `tags=${this.#getAllCheckedTags()}`;

        return baseUrl.origin + baseUrl.pathname + "?" + language + "&" + color + "&" + tags;
    }

    #syncUrlParams() {
        history.replaceState(null, "", this.#buildUrlWithParameters(window.location));
    }

    #getAllCheckedTags = () => this.#tagService.getAllCheckedTags();

    #clipboardFallback(icon, message, color){
        icon.style.display = "inline";
        icon.innerHTML = this.#translate(message);
        icon.style.background = color;

        setTimeout(() => icon.style.display = "none", 1000);
    }

    downloadResume(){
        const originalTitle = document.title;
        const documentName = `${this.#translate("Currículo")} ${this.#pageLoaderService.getResumeName()}`;

        // The browser uses the document title as the default "Save as PDF" filename.
        document.title = documentName;

        window.addEventListener("afterprint", () => {
            document.title = originalTitle;
        }, { once: true });

        window.print();
    }

    colorPick(event){
        this.#parameterService.setColor(event.target.value);

        this.#pageLoaderService.changePageColor();

        this.#syncUrlParams();
    }

    openTags(){
        const courses = this.#pageLoaderService.getResumeCourses();
        this.#tagService.openTags(courses);
    }

    closeTags = () => {
        this.#tagService.closeTags();
        this.#syncUrlParams();
    }

    selectAndUnselectTags = () => {
        this.#tagService.selectAndUnselectTags();
        this.#syncUrlParams();
    }
}
