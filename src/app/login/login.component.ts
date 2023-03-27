import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import * as Console from "console";
import {UsuariService} from "../usuari.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {sendEmailVerification, user} from "@angular/fire/auth";
import firebase from "firebase/compat";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../../assets/css/Default.css']
})
export class LoginComponent {
  [x: string]: any;
  email: any;
  passwd: any;
  correuTrobat: any;

  constructor(public router:Router, private usuariServei: UsuariService,private http:HttpClient, public firebaseAuth: AngularFireAuth) {
      this.http.get<any>('http://172.16.8.1:3080/api/firebase').subscribe((document)=> {
        this.usuariServei.arrClients = document;
      });
  }

  async autenticar() {
    var errorMessage = ' ';

    await this.firebaseAuth.signInWithEmailAndPassword(this.email, this.passwd)
      .then(res => {
        this.usuariServei.autenticat = true;
        this.usuariServei.usuari = JSON.stringify(res.user);
        this.usuariServei.correuAutenticat = this.email;
        this.correuTrobat = false;

        for (let i = 0; i < this.usuariServei.arrClients.clients.length; i++) {
          if (this.usuariServei.arrClients.clients[i].Correu == this.email) {
            this.usuariServei.posAutenticat = i;
            this.correuTrobat = true;
            this.http.post<any>('http://localhost:3080/log',{
              log: 'login',
              text: `Ha iniciat sessió un usuari amb l'adreça de correu ${this.email}`
            }).subscribe();
            this.router.navigate(['/'])
          }
        }
        if (!this.correuTrobat) {
          alert("Sembla que no disposem de les dades d'aquest client!");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        errorMessage= error.message;
      })
    if (!this.usuariServei.autenticat) {
      alert("Entrada denegada!\n" + errorMessage);
    }
  }
}


