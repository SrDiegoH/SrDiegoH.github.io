class PageLoaderService {
    #parameterService;
    #dataService;
    #resumeView;
    #resumeData;

    constructor(parameterService, dataService, resumeView) {
        this.#parameterService = parameterService;
        this.#dataService = dataService;
        this.#resumeView = resumeView;
    }

    #loadResumeData() {
        const languageCode = this.#parameterService.getShouldTranslate() ? "en" : "pt";
        this.#resumeData = this.#dataService.requestData(languageCode);
    }

    getResumeName = () => this.#resumeData.name;

    getResumeCourses = () => this.#resumeData.courses;

    loadPage() {
        this.#resumeView.changePageColor();

        this.#loadResumeData();

        this.#resumeView.render(this.#resumeData);
    }

    changePageColor = () => this.#resumeView.changePageColor();
}
