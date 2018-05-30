import {FormGroup} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

export class ErrorHandler {

  static handleFormError(err: HttpErrorResponse, group: FormGroup) {
    console.log(err);
    switch(err.status) {
      case 400:
        try {
          let errors = err.error.errors;
          if (errors) {
            Object.keys(errors).forEach(field => {
              const f = field.replace(/\[(\d+)]/gi, '.$1');
              if(group.get(f) == null) {
                alert(errors[field][0]);
              } else {
                group.get(f).setErrors({"server": errors[field][0]});
              }
            });
          } else {
            alert(err.message);
          }
        } catch (exception) {}
        break;
      case 500:
        alert(err.message);
        break;
    }
  }

}
