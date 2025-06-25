import { Domicilio } from "../DTO/domicilio";

export const domicilioMock: Domicilio = {
    numero: "123",
    calle: "Avenida Libertador",
    departamento: "5B",
    piso: "3",
    codigoPostal: "1406",
    pais_codigo: "AR",
    pais_descripcion: "Argentina",
    provincia_codigo: "CABA",
    provincia_descripcion: "Ciudad Autónoma de Buenos Aires",
    localidad_descripcion: "Palermo",
    localidad_codigo: "1406",
    legal: true
};

export const domicilioWithoutCodPostalMock: Domicilio = {
    numero: "123",
    calle: "Avenida Libertador",
    departamento: "5B",
    piso: "3",
    codigoPostal: null,
    pais_codigo: "AR",
    pais_descripcion: "Argentina",
    provincia_codigo: "CABA",
    provincia_descripcion: "Ciudad Autónoma de Buenos Aires",
    localidad_descripcion: "Palermo",
    localidad_codigo: "1406",
    legal: true
};