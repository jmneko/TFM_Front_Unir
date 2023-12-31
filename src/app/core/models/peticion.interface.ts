export interface SolicitudClase {
    id: number;
    alumno_id: number;
    profesor_id: number;
    especialidades_id: number,
    nombre: string;
    apellidos: string;
    mail: string;
    pass: string;
    foto: string;
    rol: UserRole;
    tel: string;
    pxh: number;
    experiencia: number;
    lat: number;
    lon: number;
    activo: boolean;
    fecha: string;

}

type UserRole = 'admin' | 'alumn' | 'prof';
