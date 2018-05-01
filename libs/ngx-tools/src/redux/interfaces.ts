import { Schema } from 'normalizr';
import { AnyAction } from 'redux';
import { Observable } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

export type IRequestMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IApiActionRequest {
  method: IRequestMethods;
  url: string;
  options?: { [key: string]: any };
}

export interface IApiActionHandlers {
  start: (data: any) => AnyAction;
  success: (data: any) => AnyAction;
  error: (error: HttpErrorResponse) => AnyAction;
  complete: () => AnyAction;
}

export interface IApiAction extends AnyAction {
  payload: {
    request: IApiActionRequest;
    handlers: IApiActionHandlers | string;
    cancel?: Observable<any>;
    normalizrSchema?: Schema;
    rawDataProcessor?: (data: any) => any;
  };
}
