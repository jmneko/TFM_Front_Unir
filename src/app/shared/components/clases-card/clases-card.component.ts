import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IClases } from 'src/app/core/models/datosClases.interface';
import { IUser } from 'src/app/core/models/user.interface';
import { ClasesService } from 'src/app/core/services/clases.service';


@Component({
  selector: 'app-clases-card',
  templateUrl: './clases-card.component.html',
  styleUrls: ['./clases-card.component.css']
})
export class ClasesCardComponent {

  @Input() infoUser!: IUser;

  arrDatosClases: IClases[] = [];
  alumnoId:number|any
  especialidad:string|any
  especialidadId:number|any
  profesorId:number|any
  alumno:IUser[]|any = []
  fecha:string|any
  fechas:string[]|any
  foto:string|any
  router = inject(Router)
  
  clasesService = inject(ClasesService);

  constructor() { 
  };


 async ngOnInit(): Promise<void> {
    try {
      //hacer condicion de que si entra el profesor, traiga el alumno, y si no, traiga el profesor.
      this.profesorId=this.infoUser.id
      this.arrDatosClases = await this.clasesService.getDatosProfesor(this.profesorId)
      this.alumnoId = this.arrDatosClases[0].alumno_id
      this.especialidadId = this.arrDatosClases[0].especialidades_id
      let result = await this.clasesService.getEspecialidadesByProfesorId(this.profesorId)
      this.especialidad = result[0].especialidad
      result = await this.clasesService.getDatosUsuario(this.alumnoId)
      this.alumno = result[0]
      result = await this.clasesService.getFechaByClases(this.profesorId,this.alumnoId)
      this.fecha = result[result.length-1].fecha
      this.fechas = result.length
      result = await this.clasesService.getDatosUsuario(this.alumnoId)
      this.foto = result[0].foto
    } catch (error) {
      console.log(error)
    }
  }

  routeAlForo(){
    this.router.navigate([`/foro/${this.alumnoId}`])
  }
  obtenerDatosClases() {
    const profesorId = this.infoUser.id;
    this.clasesService.getDatosProfesor(profesorId)
      .then((response: any) => {
        this.arrDatosClases = response;
      })
      .catch((error:any) => {
        console.log(error)
      })
  };

  terminarClases() {
    console.log(this.profesorId,this.alumnoId,this.especialidadId)
    this.clasesService.terminarClases(this.profesorId,this.alumnoId,this.especialidadId)
    .then((response: any)=>{
      console.log(response)
    })
    .catch((error)=>{
      console.log(error)
    })
  }
}
