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
        String Featured;
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Libraries.SongName, Libraries.ArtistName, Libraries.FeatureName FROM Libraries INNER JOIN Resources ON Libraries.SongID = Resources.SongID INNER JOIN USERS ON (Resources.UserID = Users.UserID) WHERE (Users.Token IS NOT NULL) ORDER BY SongName");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("SongName", results.getString(1));
                row.put("ArtistName", results.getString(2));
                if (results.getString(3) == null){
                    Featured = "";
                }else{
                    Featured = results.getString(3);
                }
                row.put("FeatureName", Featured);
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
    @Path("delete/{SongName}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String DeleteResource(@PathParam("SongName") String SongName) throws Exception {
        System.out.println("Invoked Resources.DeleteResource()");
        if (SongName == null) {
            throw new Exception("SongName is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("Delete From Resources Where SongID = (Select SongID From Libraries Where SongName = ?)");
            ps.setString(1, SongName);
            ps.execute();
            return "{\"OK\": \"Song deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
