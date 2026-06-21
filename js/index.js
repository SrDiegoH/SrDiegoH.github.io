window.onload = () => {
    const parameterService = new ParameterService();

    const tagService = new TagService(parameterService);

    const dataService = new DataService();

    const resumeView = new ResumeView(parameterService);

    const pageLoaderService = new PageLoaderService(parameterService, dataService, resumeView);

    const eventController = new EventController(parameterService, pageLoaderService, tagService);

    pageLoaderService.loadPage();

    document.getElementById("menu_icon")
            .addEventListener("click", (event) => eventController.openAndCloseMenu(event));

    document.getElementById("share_icon")
            .addEventListener("click", () => eventController.copyLinkToClipboard());

    document.getElementById("translate_button")
            .addEventListener("click", (event) => eventController.changeTranslation(event));

    document.getElementById("download_icon")
            .addEventListener("click", () => eventController.downloadResume());

    document.getElementById("tags_icon")
            .addEventListener("click", () => eventController.openTags());

    document.getElementById("close_tags_icon")
            .addEventListener("click", () => eventController.closeTags());

    document.getElementById("select_all_tags")
            .addEventListener("click", () => eventController.selectAndUnselectTags());

    document.getElementById("color_picker")
            .addEventListener("change", (event) => eventController.colorPick(event), false);
}