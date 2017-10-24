export interface ITheme {
    title: string;  // Títulos y algunos textos cortos.
    text: string; // Textos largos en general
    text2: string; // Source y Movie Categories
    background: string;// Color de fondo de la aplicación
    backgroundCarouselCard: string;// Fondo de la información expandida de las cards en carousel
    backgroundCardSection: string; // Fondo de cada sección de Card Detail
    backgroundBtn: string; // Fondo de los botones cuando no están selecionados.
    textBtn: string; // Color de texto de los botones cuando no están seleccionados.
    textBtnSelected: string; // Texto sobre boton seleccionada.
    selected: string; // Color de superficie seleccionada
    unselected: string; // Color de bordes y algunas superficies sin seleccionar.
}

export const Theme = {
    title: 'cyan',
    text: 'green',
    text2: 'verdosin',
    textSelected: 'como el background',
    background: "",
    backgroundCarouselCard: '',
    backgroundCardSection: '',
    selected: 'orange',
    unselected: '',
};
