package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("libraries/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Libraries{
    @GET
    @Path("list/{Genre}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String LibrariesList(@PathParam("Genre") String Genre) throws Exception {
        System.out.println("Invoked Libraries.LibrariesList()");
        JSONArray response = new JSONArray();
        if (Genre == null) {
            throw new Exception("Genre is missing in the HTTP request's URL.");
        }
        String Featured;
        try {
            PreparedStatement ps = Main.db.prepareStatement("Select SongID, SongName, ArtistName, FeatureName From Libraries WHERE (SongID NOT IN (SELECT SongID FROM Resources INNER JOIN Users ON Resources.UserID = Users.UserID WHERE Users.Token IS NOT NULL))  AND (Genre = ?) AND (Explicit <= (SELECT AllowExplicit FROM Users WHERE Token IS NOT NULL)) Order By SongName");
            ps.setString(1, Genre);
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("SongID", results.getInt(1));
                row.put("SongName", results.getString(2));
                row.put("ArtistName", results.getString(3));
                if (results.getString(4) == null){
                    Featured = "";
                }else{
                    Featured = results.getString(4);
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
    @GET
    @Path("search/{Searcher}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String LibrariesSearch(@PathParam("Searcher") String Search){
        System.out.println("Invoked Libraries.LibrariesSearch()");
        JSONArray response = new JSONArray();
        String Featured;
        Search = "%" + Search + "%";
        try {
            PreparedStatement ps = Main.db.prepareStatement("Select SongID, SongName, ArtistName, FeatureName From Libraries WHERE (SongName LIKE ?) AND SongID NOT IN (SELECT SongID FROM Resources INNER JOIN Users ON Resources.UserID = Users.UserID WHERE Users.Token IS NOT NULL) AND (Explicit <= (SELECT AllowExplicit FROM Users WHERE Token IS NOT NULL)) Order By SongName");
            ps.setString(1, Search);
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("SongID", results.getInt(1));
                row.put("SongName", results.getString(2));
                row.put("ArtistName", results.getString(3));
                if (results.getString(4) == null){
                    Featured = "";
                }else{
                    Featured = results.getString(4);
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
    public String LibrariesAdd(@FormDataParam("SongName") String SongName, @FormDataParam("Explicit") Boolean Explicit, @FormDataParam("ArtistID") Integer ArtistID, @FormDataParam("FeatureID") Integer FeatureID) {
        System.out.println("Invoked Libraries.LibrariesAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Libraries (SongName, Explicit, ArtistID, FeatureID) VALUES (?, ?, ?, ?)");
            ps.setString(1, SongName);
            ps.setBoolean(2, Explicit);
            ps.setInt(3, ArtistID);
            ps.setInt(4, FeatureID);
            ps.execute();
            return "{\"OK\": \"Added Song.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
