import { TipoDocumento } from "../DTO/tipo-documento";

export const mockTipoDocumentos: TipoDocumento[] = [
    { id: "1", codigoSoa: "DNI", label: "Documento Nacional de Identidad", orden: 1 },
    { id: "2", codigoSoa: "LC", label: "Libreta Cívica", orden: 2 },
    { id: "3", codigoSoa: "LE", label: "Libreta de Enrolamiento", orden: 3 }
];