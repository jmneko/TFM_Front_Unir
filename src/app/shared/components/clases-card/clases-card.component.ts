import { Component, Input, inject } from '@angular/core';
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
  @Input() iclases!: IClases;

  arrDatosClases: IClases[] = [];

  terminarClasesServices = inject(ClasesService);

  constructor() { };


  ngOnInit(): void {
    //Recuperacion de datos de las clases del usuario al iniciar el componente.
    this.obtenerDatosClases();

  }


  obtenerDatosClases() {
    const profesorId = this.infoUser.id;
    this.terminarClasesServices.obtenerDatosClases(profesorId)
      .subscribe((response: any) => {
        this.arrDatosClases = response;
      })
  };

  terminarClases() {
    const fecha = this.iclases.fecha;
    const especialidadId = this.iclases.especialidades_id
    const profesorId = this.infoUser.id;
    const alumnoId = this.iclases.alumno_id
    this.terminarClasesServices.terminarClases(profesorId, alumnoId, especialidadId)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });

  };

}
