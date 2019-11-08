//MODULES
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTS
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

import { UserGuard } from '../services/user.guard'; 

const messagesRoutes: Routes = [
  
    {
        path: 'messages', 
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'send', pathMatch: 'full'},
            { path: 'send', component: AddComponent, canActivate:[UserGuard]},
            { path: 'received', component: ReceivedComponent, canActivate:[UserGuard]},
            { path: 'received/:page', component: ReceivedComponent, canActivate:[UserGuard]},
            { path: 'sent', component: SentComponent, canActivate:[UserGuard]},
            { path: 'sent/:page', component: SentComponent, canActivate:[UserGuard]}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(messagesRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class MessagesRoutingModule {}