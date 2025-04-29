export function formatRealeaseDate(date) {
    return new Date(date).toLocaleDateString("en-Us", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}