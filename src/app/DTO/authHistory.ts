export class ResponseAuthHistory {
	response: AuthHistory;
	status: number;
	timestamp: string;
}

export class AuthHistory {
    id_persona: string;
    auditorias_autenticacion: AuthHistoryList[] = [];
}

export class AuthHistoryList {
    id: string;
	fecha_autenticacion: Date;
	canal: string;
	status_prueba_de_vida: string;
	status_plantilla_facial_extendida: string;
	similitud_plantilla_facial_extendida: number;
	status_mejor_imagen_facial: string;
	similitud_mejor_imagen_facial: number;
}


export class ResponsePictureHistoryItem {
	response: string;
	status: number;
	timestamp: string;
}