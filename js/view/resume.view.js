class ResumeView {
    #parameterService;

    constructor(parameterService) {
        this.#parameterService = parameterService;
    }

    #translate = (text) => translate(this.#parameterService.getShouldTranslate(), text);

    render(data) {
        this.#changePageName(data.name);
        this.#loadTitle(data);
        this.#loadAboutMe(data.about_me);
        this.#loadLanguages(data.languages);
        this.#loadHardSkills(data.hard_skills);
        this.#loadSoftSkills(data.soft_skills);
        this.#loadObjective(data.career_goal);
        this.#loadSummary(data.summary);
        this.#loadExperiences(data.professional_experiences);
        this.#loadEducationsAndCourses(data);
    }

    changePageColor() {
        const color = this.#parameterService.getColor();

        document.querySelectorAll(".dynamic-color-background")
                .forEach(item => item.style.background = color);

        document.querySelectorAll(".dynamic-color-line")
                .forEach(item => item.style.backgroundImage =
                `linear-gradient(to right, transparent, ${color}, transparent)`);

        document.querySelectorAll(".dynamic-color-text")
                .forEach(item => item.style.color = color);
    }

    #changePageName = (name) => document.title = name;

    #loadTitle(data) {
        let text = `<h2 class='dynamic-color-text'>${data.name}</h2>`;
        text += `</br><h3 class='dynamic-color-text'>${data.office}</h3>`;

        document.getElementById("title").innerHTML = text;

        document.querySelectorAll(".dynamic-color-text")
                .forEach(item => item.style.color = this.#parameterService.getColor());
    }

    #loadAboutMe(aboutMe) {
        let text = `<h3>${this.#translate("SOBRE MIM")}</h3>`;
        text += `<label><img src='./resources/assets/birth_date.png'/>${aboutMe.birth_date}</label></br>`;
        text += `<label><img src='./resources/assets/zap.png'/>${aboutMe.phones}</label></br>`;
        text += `<label class='about-me-small-text'><img src='./resources/assets/email.png'/><a href='mailto:${aboutMe.emails}'>${aboutMe.emails}</a></label></br>`;
        text += `<label class='about-me-small-text'><img class='about-me-small-icon' src='./resources/assets/local.png'/>${aboutMe.address}</label></br>`;
        text += `<label><img src='./resources/assets/github.png'/><a href='${aboutMe.github}' target='_blank'>GitHub</a></label></br>`;
        text += `<label><img src='./resources/assets/linkedin.png'/><a href='${aboutMe.linkedin}' target='_blank'>LinkedIn</a></label>`;

        document.getElementById("about_me").innerHTML = text;
    }

    #loadLanguages(languages) {
        let text = `<h3>${this.#translate("LÍNGUAS")}</h3><table>`;

        for (const languageInfos of languages) {
            text += `<tr><td><strong>${languageInfos.language}:</strong></td><td>${languageInfos.level}</td></tr>`;
        }

        text += "</table>";

        document.getElementById("languages").innerHTML = text;
    }

    #loadHardSkills(hard_skills) {
        let text = `<h3>${this.#translate("HABILIDADES TÉCNICAS")}</h3>`;
        text += hard_skills.map(skill => this.#buildHardSkill(skill)).join("");

        document.getElementById("hard_skills").innerHTML = text;
    }

    #buildHardSkill(hard_skill) {
        let text = `<h4><div class='hard-skills-description'>${hard_skill.description}</div></h4>`;
        text += this.#buildHardSkillItems(hard_skill.items);

        return text;
    }

    #buildHardSkillItems = (items) => `<h5><div class='hard-skills-items'>${items.map(skill => skill).join(", ")}</div></h5>`;

    #loadSoftSkills(soft_skills) {
        let text = `<h3>${this.#translate("HABILIDADES COMPORTAMENTAIS")}</h3><table>`;
        text += soft_skills.map(skill => `<tr><td>${skill}</td></tr>`).join("");
        text += "</table>";

        document.getElementById("soft_skills").innerHTML = text;
    }

    #loadObjective = (careerGoal) => {
        let text = `<h3>${this.#translate("OBJETIVO DE CARREIRA")}</h3>`;
        text += `<p>${careerGoal}</p>`;

        document.getElementById("objective").innerHTML = text;
    }

    #loadSummary = (summary) => {
        let text = `<h3>${this.#translate("RESUMO")}</h3>`;
        text += summary.map(paragraph => `<p>${paragraph}</p>`).join("");

        document.getElementById("summary").innerHTML = text;
    }

    #loadExperiences(experiences) {
        let text = `<h3>${this.#translate("EXPERIÊNCIAS PROFISSIONAIS")}</h3>`;
        text += experiences.map(experience => this.#loadExperience(experience)).join("");

        document.getElementById("experiences").innerHTML = text;
    }

    #loadExperience(experience) {
        let text = `<h4>${experience.company}</h4>`;
        text += this.#buildActivities(experience.activities);

        return text;
    }

    #buildActivities = (activities) => activities
        .map(activity => {
            const startDate = convertDateToMonthAndYear(activity.start_date);
            const endDate = validateAndReturnDate(activity.end_date, this.#translate("atualmente"));

            return `<h5>${activity.office}  (${startDate} - ${endDate})</h5>${this.#buildDescriptions(activity.descriptions)}</br>`;
        })
        .join("");

    #buildDescriptions = (descriptions) => descriptions
        .map(description => `<p>${description}</p>`)
        .join("");

    #loadEducationsAndCourses(data) {
        let text = this.#loadEducations(data.educations) + this.#loadCourses(data.courses);

        document.getElementById("education").innerHTML = text;
    }

    #loadEducations(educations) {
        let text = `<h3>${this.#translate("EDUCAÇÃO")}</h3>`;

        const sortedEducations = educations.sort((firstDate, secondDate) => sortDates(firstDate.start_date, secondDate.start_date));

        text += sortedEducations.map(education => this.#buildEducation(education)).join("");

        return text;
    }

    #buildEducation(education) {
        const startDate = convertDateToMonthAndYear(education.start_date);
        const endDate = validateAndReturnDate(education.end_date, this.#translate("atualmente"));

        const educationCourse = education.course ? " - " + education.course : "";

        let text = `<h4>${education.type?.toString().toUpperCase()}</h4>`;
        text += `<h5>${education.educational_institution + educationCourse}`;
        text += ` (${startDate} - ${endDate})</h5></br>`;

        return text;
    }

    #loadCourses(courses) {
        let text = `<h4>${this.#translate("CURSOS E CERTIFICADOS")}</h4>`;

        const sortedCourses = courses.sort((first, second) => sortTexts(first.course, second.course));

        text += sortedCourses.map(course => this.#buildCourse(course)).join("");

        return text;
    }

    #buildCourse(course) {
        const startDate = course.start_date ? convertDateToMonthAndYear(course.start_date) + " - " : "";
        const endDate = convertDateToMonthAndYear(course.end_date);

        const courseTags = course.tags.map(tag => tag.toUpperCase());

        let text = `<p data-tags='${courseTags}' style='display: ${this.#displayMode(courseTags)}'>`;
        text += `${course.educational_institution} - ${course.course}`;
        text += ` (${startDate + endDate})</p>`;

        return text;
    }

    #displayMode(tags) {
        if (this.#parameterService.areAllTagsCached())
            return "block";

        const courseHasAnyTagOnCache = this.#parameterService.arrayHasAnyTagOnCache(tags);

        return courseHasAnyTagOnCache ? "block" : "none";
    }
}