package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("artists/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Artists{
    @GET
    @Path("list")
    public String ArtistsList() {
        System.out.println("Invoked Artists.ArtistsList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ArtistID, ArtistName FROM Artists");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("ArtistID", results.getInt(1));
                row.put("ArtistName", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }
    @POST
    @Path("add")
    public String ArtistsAdd(@FormDataParam("ArtistName") String ArtistName){
        System.out.println("Invoked Artists.ArtistsAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Artists (ArtistName) VALUES (?)");
            ps.setString(1, ArtistName);
            ps.execute();
            return "{\"OK\": \"Added Artist.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
