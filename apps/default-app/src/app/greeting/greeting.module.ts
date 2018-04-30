import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreetingComponent } from './greeting.component';


const routes: Routes = [{ path: '', component: GreetingComponent }];

@NgModule({
  declarations: [GreetingComponent],
  imports: [RouterModule.forChild(routes)],
})
export class GreetingModule {}
