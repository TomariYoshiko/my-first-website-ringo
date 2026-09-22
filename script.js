document.addEventListener("DOMContentLoaded", () => {

    const title = document.getElementById("title");

    title.style.opacity = 0;
    title.style.transform = "translateY(-10px)";

    setTimeout(() => {
        title.style.transition = "all 0.8s ease";
        title.style.opacity = 1;
        title.style.transform = "translateY(0)";
    }, 100);

    const button = document.getElementById("scrollButton");

    button.addEventListener("click", () => {
        document.getElementById("about").scrollIntoView({
            behavior: "smooth"
        });
    });

});