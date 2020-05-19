export default class Move {
    static noMove () {
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
    }
    static move () {
        document.body.style.position = "static";
        document.body.style.height = "auto";
    }
}