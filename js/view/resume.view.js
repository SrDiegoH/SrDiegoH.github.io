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
        this.#loadInterests(data.interests);
        this.#loadLanguages(data.languages);
        this.#loadSkills(data.skills);
        this.#loadTechnicalProficiencies(data.technical_proficiencies);
        this.#loadObjective(data.career_goal);
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
        text += `<label class='about-me-small-text'><img src='./resources/assets/email.png'/>${aboutMe.emails}</label></br>`;
        text += `<label class='about-me-small-text'><img class='about-me-small-icon' src='./resources/assets/local.png'/>${aboutMe.address}</label></br>`;
        text += `<label><img src='./resources/assets/github.png'/><a href='${aboutMe.github}' target='_blank'>GitHub</a></label></br>`;
        text += `<label><img src='./resources/assets/linkedin.png'/><a href='${aboutMe.linkedin}' target='_blank'>LinkedIn</a></label>`;

        document.getElementById("about_me").innerHTML = text;
    }

    #loadInterests(interests) {
        let text = `<h3>${this.#translate("INTERESSES")}</h3><table><tr>`;

        let columns = 0;

        for (const interest of interests) {
            if (columns == AppConfig.INTERESTS_COLUMNS) {
                text += "</tr><tr>";
                columns = 0;
            }

            text += `<td>${interest}</td>`;

            columns++;
        }

        text += "</tr></table>";

        document.getElementById("interests").innerHTML = text;
    }

    #loadLanguages(languages) {
        let text = `<h3>${this.#translate("LÍNGUAS")}</h3><table>`;

        for (const languageInfos of languages) {
            text += `<tr><td>${languageInfos.language}</td><td>`;
            text += this.#buildStarLevel(languageInfos.level);
            text += `</td></tr>`;
        }

        text += "</table>";

        document.getElementById("languages").innerHTML = text;
    }

    #buildStarLevel = (level) => [0, 1, 2]
            .map(i => `<img src='./resources/assets/star_${i <= level - 1 ? "yellow" : "white"}.png'/>`)
            .join("");

    #loadSkills(skills) {
        let text = `<h3>${this.#translate("COMPETÊNCIAS")}</h3><table>`;
        text += skills.map(skill => `<tr><td>${skill}</td></tr>`).join("");
        text += "</table>";

        document.getElementById("skills").innerHTML = text;
    }

    #loadTechnicalProficiencies(technical_proficiencies) {
        let text = `<h3>${this.#translate("HABILIDADES TÉCNICAS")}</h3><table>`;
        text += technical_proficiencies.map(proficiency => this.#buildTechnicalProficiencies(proficiency))
                                       .join("");
        text += "</table>";

        document.getElementById("technical_proficiencies").innerHTML = text;
    }

    #buildTechnicalProficiencies(proficiency) {
        let text = `<tr><td class='tech-desc-cell'><div class='technical-proficiencies-description'>${proficiency.description}</div></td><td><table>`;
        text += this.#buildSkills(proficiency.skills);
        text += "</table></td></tr>";

        return text;
    }

    #buildSkills = (skills) => skills
        .map(skill => `<tr><td class='tech-skills-cell'><div class='technical-proficiencies-skills'>${skill}</div></td></tr>`)
        .join("");

    #loadObjective = (careerGoal) => {
        let text = `<h3>${this.#translate("OBJETIVO DE CARREIRA")}</h3>`;
        text += `<p>${careerGoal}</p>`;

        document.getElementById("objective").innerHTML = text;
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

            return `<h5>${activity.office}  (${startDate} - ${endDate})</h5><p>${activity.description}</p>`;
        })
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