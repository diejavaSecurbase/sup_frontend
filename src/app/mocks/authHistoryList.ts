import { AuthHistory, ResponseAuthHistory } from "../DTO/authHistory";

export const mockAuthHistory: AuthHistory = {
    id_persona: '123456',
    auditorias_autenticacion: [
        {
            id: '1',
            fecha_autenticacion: new Date('2024-02-24T12:00:00Z'),
            canal: 'MOBI',
            status_prueba_de_vida: 'POSITIVE',
            status_plantilla_facial_extendida: 'POSITIVE',
            similitud_plantilla_facial_extendida: 99.15,
            status_mejor_imagen_facial: 'POSITIVE',
            similitud_mejor_imagen_facial: 98.3
        }
    ]
}

export const mockResponseAuthHistory: ResponseAuthHistory = {
    response: mockAuthHistory,
    status: 1,
    timestamp: ""
}