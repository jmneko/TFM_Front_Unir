import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IClases } from 'src/app/core/models/datosClases.interface';
import { IUser } from 'src/app/core/models/user.interface';
import { ClasesService } from 'src/app/core/services/clases.service';
import { UsersService } from 'src/app/modules/auth/services/users.service';
import { ClasesAlumnosService } from 'src/app/modules/clases-alumno/services/clasesAlumnos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-clases-card',
  templateUrl: './clases-card.component.html',
  styleUrls: ['./clases-card.component.css']
})
export class ClasesCardComponent {

  @Input() infoUser!: any;

  comentario: string = '';
  arrUsuarioClases: IClases[] = [];
  arrDatosClases: IClases[] = [];
  alumnoId: number | any
  especialidad: string | any
  especialidadId: number | any
  profesorId: number | any
  rol: string | any
  usuario: IUser[] | any = []
  fecha: string | any
  fechas: string[] | any
  esAlumno: boolean = false

  rating: number = 0;
  hoveredStar: number = 0;
  clicked = false
  isPuntuacion: boolean | any


  router = inject(Router)
  clasesService = inject(ClasesService);
  alumnosClasesServices = inject(ClasesAlumnosService);
  activateRoute = inject(ActivatedRoute)



  constructor() {
  };


  async ngOnInit(): Promise<void> {
    
    this.activateRoute.params.subscribe(async (params: any) => {
      try {
        let id = params.usuarioId;
        this.arrUsuarioClases = await this.alumnosClasesServices.getClasesByUsuarioId(id);
          this.profesorId = this.infoUser.profesor_id;
          this.alumnoId = this.infoUser.alumno_id;
          this.especialidadId = this.infoUser.especialidades_id;

          // obtenemos la especialidad
          const result = await this.clasesService.getEspecialidadesByProfesorId(this.profesorId);
          this.especialidad = result[0].especialidad;

          // Obtenemos datos del usuario (profesor o alumno)
          let userResult = await this.clasesService.getDatosUsuario(id);
          this.esAlumno = userResult[0].rol=="alumn"?true:false
          userResult = await this.clasesService.getDatosUsuario(this.esAlumno==true?this.profesorId:this.alumnoId);
          this.usuario = userResult[0];
          // Obtenemos fechas de las clases
          const dateResult = await this.clasesService.getFechaByClases(this.infoUser.profesor_id, this.infoUser.alumno_id, this.infoUser.especialidades_id);
          this.fecha = dateResult[dateResult.length - 1].fecha;
          this.fechas = dateResult.length;
          

          try {
            const response = await this.clasesService.getPuntuaciones(this.infoUser.usuario.id, this.alumnoId);
            if (response.length == 0) {
              this.isPuntuacion = false;
            } else {
              this.isPuntuacion = true;
            }
          } catch (error) {
            alert(`Error al obtener puntuaciones:${error}`);
            this.isPuntuacion = false;
          }
      } catch (error) {

      };
    })


  }


  resetComentario(): void {
    if (this.comentario === "") {
      return;
    }
    this.comentario = "";
  }
  setRating(value: number): void {
    this.clicked = false
    this.rating = value;
    this.hoveredStar = value;
  }

  resetRating(): void {
    if (this.rating === 0) {
      return;
    }
    this.hoveredStar = this.rating;
  }

  resetHoveredStar(): void {
    if (!this.clicked) {
      this.rating = 0
      this.hoveredStar = 0
    }

  }

  submitRating(value: number): void {
    this.rating = value;
    this.clicked = true;
    this.updateStars();
  }

  updateStars(): void {
    for (let i = 1; i <= 5; i++) {
      const starElement = document.querySelector(`.star:nth-child(${i})`);
      if (starElement) {
        if (i <= this.rating || (i <= this.hoveredStar && !this.clicked)) {
          starElement.classList.add('active');
        } else {
          starElement.classList.remove('active');
        }
      }
    }
  }
  async enviarPuntuacion(): Promise<void> {
    try {
      await this.clasesService.insertarOpinionAlumno(this.profesorId, this.alumnoId, this.rating, this.comentario);
      // Éxito
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Tu valoración se ha enviado correctamente.'
      });
      this.resetRating();
      this.resetComentario();

    } catch (error) {
      // Error
      alert(`Error al enviar la puntuación:${error}`);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar la puntuación.'
      });
    }
  }
  async obtenerPuntuaciones(): Promise<any> {

  }
  routeAlForo() {
    this.router.navigate([`/foro/${this.profesorId}&${this.alumnoId}`])
  }

  obtenerDatosClases() {
    const profesorId = this.infoUser.id;
    this.clasesService.getDatosProfesor(profesorId)
      .then((response: any) => {
        this.arrDatosClases = response;
      })
      .catch((error: any) => {
        alert(error)
      })
  };

  terminarClases() {
    this.clasesService.terminarClases(this.profesorId, this.alumnoId, this.especialidadId)
      .then((response: any) => {
        console.log(response)
      })
      .catch((error) => {
        alert(error)
      })
  }

  borrarClases() {
    this.clasesService.borrarClases(this.infoUser.id)
      .then((response: any) => {
        Swal.fire({
          title: 'Clases terminadas',
          text: 'Las clases han sido terminadas satisfactoriamente',
          icon: 'success',
          confirmButtonText: 'OK'
      });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al intentar terminar las clases',
          icon: 'error',
          confirmButtonText: 'OK'
      });
      })
  }

  terminarYBorrarClases() {
    this.terminarClases();
    this.borrarClases();
    this.router.navigate(['/home'])
  }
        
 }

