package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("resources/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Resources{
    @GET
    @Path("list")
    public String ResourceList() {
        System.out.println("Invoked Resources.ResourceList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Libraries.SongName, Artists.ArtistName FROM Artists INNER JOIN Libraries ON Artists.ArtistID = Libraries.ArtistID INNER JOIN Resources ON Libraries.SongID = Resources.SongID INNER JOIN USERS ON (Resources.UserID = Users.UserID) WHERE (Users.Token IS NOT NULL) ORDER BY SongName" + "");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("SongName", results.getString(1));
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
    public String LibrariesAdd(@FormDataParam("SongID") Integer SongID, @FormDataParam("UserID") Integer UserID) {
        System.out.println("Invoked Resources.ResourcesAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Resources (SongID, UserID) VALUES (?, ?)");
            ps.setInt(1, SongID);
            ps.setInt(2, UserID);
            ps.execute();
            return "{\"OK\": \"Added Song.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
    @POST
    @Path("delete/{ResourceID}")
    public String DeleteResource(@PathParam("ResourceID") Integer ResourceID) throws Exception {
        System.out.println("Invoked Resources.DeleteResource()");
        if (ResourceID == null) {
            throw new Exception("ResourceID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Resources WHERE ResourceID = ?");
            ps.setInt(1, ResourceID);
            ps.execute();
            return "{\"OK\": \"Song deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
