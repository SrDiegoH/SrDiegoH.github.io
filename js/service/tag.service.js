class TagService {
    #parameterService;
    #tagView;

    #areAllTagsCached;
    #tags;

    constructor(parameterService, tagView) {
        this.#parameterService = parameterService;
        this.#tagView = tagView;

        this.#areAllTagsCached = this.#parameterService.areAllTagsCached();
        this.#tags = {};
    }

    #translate = (text) => translate(this.#parameterService.getShouldTranslate(), text);

    getAllCheckedTags() {
        const tagNames = Object.keys(this.#tags);

        const allCheckedTags = tagNames.filter(tagName => this.#tags[tagName] === true);

        if(!allCheckedTags.length)
            return ALL_TAGS;

        return tagNames.length === allCheckedTags.length ? ALL_TAGS : allCheckedTags.join();
    }

    closeTags = () => this.#tagView.closeModal();

    openTags(courses) {
        this.#tagView.openModal();

        this.#fillAllTags(courses);

        this.loadTagsText();

        this.#tagView.setTableHtml(this.#buildTagsHtml());
        this.#tagView.addTagListeners((name, checked) => this.#onTagChange(name, checked));
    }

    #fillAllTags(courses) {
        if(Object.keys(this.#tags).length !== 0) return;

        this.#tags = courses.reduce((tagDictionary, course) => {
            course.tags.forEach(tagTarget => {
                if(!tagDictionary[tagTarget.toUpperCase()])
                    tagDictionary[tagTarget.toUpperCase()] = this.#isTagChecked(tagTarget);
            });
            return tagDictionary;
        }, {});
    }

    #isTagChecked = (tagTarget) => this.#areAllTagsCached ||
                                   this.#parameterService.isTagInCache(tagTarget);

    #buildTagsHtml() {
        const sortedTags = Object.keys(this.#tags).sort((first, second) => sortTexts(first, second));

        let text = "<table><tr>";
        let counter = 0;

        for(const tag of sortedTags) {
            if(counter === AppConfig.TAGS_COLUMNS) {
                text += "</tr><tr>";
                counter = 0;
            }

            const isChecked = this.#tags[tag] ? "checked" : "";

            text += `<td><label><input class='tag' type='checkbox' ${isChecked} name='${tag}'>${tag}</label></td>`;

            counter++;
        }

        text += "</tr></table>";
        return text;
    }

    #onTagChange(name, checked) {
        this.#tags[name] = checked;
        this.#tagView.filterCourse(name, checked ? "block" : "none");
    }

    #verifyIfAllTagsCached = () => !Object.keys(this.#tags).some(tagName => this.#tags[tagName] === false);

    loadTagsText() {
        this.#tagView.setTitle(`<h2>${this.#translate("Selecione os cursos pela tag")}</h2>`);

        this.#areAllTagsCached = this.#verifyIfAllTagsCached();

        this.#tagView.setButtonText(this.#selectAllTagsText(this.#areAllTagsCached));
    }

    #selectAllTagsText = (isChecked) => this.#translate(isChecked ? "Desmarcar todos" : "Marcar todos");

    selectAndUnselectTags() {
        this.#areAllTagsCached = !this.#verifyIfAllTagsCached();

        this.#tagView.setAllTagsChecked(this.#areAllTagsCached, (name, checked) => this.#onTagChange(name, checked));

        this.#tagView.setButtonText(this.#selectAllTagsText(this.#areAllTagsCached));
    }
}
