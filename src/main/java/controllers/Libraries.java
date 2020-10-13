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
    @Path("list")
    public String LibrariesList() {
        System.out.println("Invoked Libraries.LibrariesList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT SongID, SongName, ArtistID, FeatureID FROM Libraries");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("SongID", results.getInt(1));
                row.put("SongName", results.getString(2));
                row.put("ArtistID", results.getInt(3));
                row.put("FeatureID", results.getInt(4));
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
