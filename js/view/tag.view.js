class TagView {
    openModal = () => document.getElementById("tags").style.visibility = "visible";

    closeModal = () => document.getElementById("tags").style.visibility = "hidden";

    setTableHtml = (html) => document.getElementById("tags_table").innerHTML = html;

    setTitle = (html) => document.getElementById("tags_title").innerHTML = html;

    setButtonText = (text) => document.getElementById("select_all_tags").value = text;

    addTagListeners(onTagChange) {
        document.querySelectorAll(".tag")
                .forEach(element => element.addEventListener(
                    "change",
                    (event) => onTagChange(event.target.name, event.target.checked),
                    false
                ));
    }

    setAllTagsChecked(checked, onTagChange) {
        document.querySelectorAll(".tag").forEach(tagToggle => {
            tagToggle.checked = checked;
            onTagChange(tagToggle.name, checked);
        });
    }

    filterCourse(tagName, displayValue) {
        document.querySelectorAll(`#education [data-tags*="${tagName}"]`)
                .forEach(element => element.style.display = displayValue);
    }
}
