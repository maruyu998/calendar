
import { 
  connectGoogleCalendar
} from '../../utils/GoogleCalendar';

export default function Setting(){

  return (
    <div className="p-5 bg-white shadow-lg">
      <h1>Google Calendar Credentials</h1>
      <p>pick the credential data from GCP console</p>
      <form name="show_credential" onSubmit={e=>{
          e.preventDefault();
          connectGoogleCalendar({
            client_id: e.currentTarget.client_id.value,
            client_secret: e.currentTarget.client_secret.value,
            redirect_uri: e.currentTarget.redirect_uri.value
          }).then(()=>{window.location.href = "/"})
        }}>
        <div className="mb-3">
          <label htmlFor="client_id" className="form-level">client_id</label>
          <input type="text" id="client_id" className="form-control"/>
        </div>
        <div className="mb-3">
          <label htmlFor="client_secret" className="form-level">client_secret</label>
          <input type="text" id="client_secret" className="form-control"/>
        </div>
        <div className="mb-3">
          <label htmlFor="redirect_uri" className="form-level">redirect_uri</label>
          <input type="text" id="redirect_uri" className="form-control"/>
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  )
}