import { Component, OnInit } from '@angular/core';
import { VersionService } from 'src/app/services/HttpServices/version.service'
import { XfsApiService } from '../services/huella/xfs-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  version: string;
  versionDriver: string = "";

  constructor( private versionService: VersionService, private xfsService : XfsApiService ) { }

  ngOnInit(): void {
    this.versionService.getVersion().subscribe(response=>{
      this.version = response;
    },
    error =>{
      this.version = "not found";
    });

    this.xfsService.checkScanFingerPrintVersion().subscribe( success => {
      if (success) {
        this.versionDriver = "1.0.3";
      }
    },
    error =>{
      this.versionDriver = '';
    });
  }

}
