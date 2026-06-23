class ParameterService {
    #PARAMETER_NAME

    #parameters;

    constructor(){
        this.#PARAMETER_NAME = {
            "COLOR": "color",
            "SHOULD_TRANSLATE": "shouldTranslate",
            "TAGS": "tags"
        }

        this.#fillParametersWithUrlQuery();
    }

    #getParameter = (key) => this.#parameters[key];
    #setParameter = (key, value) => this.#parameters[key] = value;
    #hasParameterFilled = (key) => Boolean(this.#parameters[key]);

    getColor = () => "#" + this.#getParameter(this.#PARAMETER_NAME.COLOR);
    setColor = (value) => this.#setParameter(this.#PARAMETER_NAME.COLOR, value.replace("#", ""));
    #hasColorFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.COLOR);

    getShouldTranslate = () => convertToBoolean(this.#getParameter(this.#PARAMETER_NAME.SHOULD_TRANSLATE));
    setShouldTranslate = (value) => this.#setParameter(this.#PARAMETER_NAME.SHOULD_TRANSLATE, value);
    #hasShouldTranslateFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.SHOULD_TRANSLATE);

    getTags = () => convertToArray(this.#getParameter(this.#PARAMETER_NAME.TAGS)).map(tag => tag.replace("%20", " ").toUpperCase());
    setTags = (value) => this.#setParameter(this.#PARAMETER_NAME.TAGS, value);
    #hasTagsFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.TAGS);
    areAllTagsCached = () => this.getTags().includes(ALL_TAGS);
    isTagInCache = (tagTarget) => this.getTags().some(tag => tag === tagTarget.toUpperCase());
    arrayHasAnyTagOnCache = (array) => this.getTags().some(tag => array.includes(tag))

    #fillParametersWithUrlQuery(){
        const urlQuery = window.location.search;

        this.#parameters = urlQuery? convertQueryToJson(urlQuery) : {};

        if(!this.#hasColorFilled())
            this.setColor(AppConfig.DEFAULT_COLOR);

        if(!this.#hasShouldTranslateFilled())
            this.setShouldTranslate(false);

        if(!this.#hasTagsFilled())
            this.setTags(ALL_TAGS);
    }
}
