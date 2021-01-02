package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("playlists/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Playlists{
    @GET
    @Path("list/")
    public String PlaylistList() {
        System.out.println("Invoked Playlists.PlaylistList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT PlaylistID, PlaylistName FROM Playlists WHERE UserID = (SELECT UserID FROM Users WHERE Token IS NOT NULL) ORDER BY PlaylistName");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("PlaylistID", results.getInt(1));
                row.put("PlaylistName", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }
    @POST
    @Path("add/")
    public String PlaylistsAdd(@FormDataParam("PlaylistName") String PlaylistName, @FormDataParam("Description") String Description) {
        System.out.println("Invoked Playlists.PlaylistsAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Playlists (UserID, PlaylistName, Description) VALUES ((SELECT UserID FROM Users WHERE Token IS NOT NULL), ?, ?)");
            ps.setString(1, PlaylistName);
            ps.setString(2, Description);
            ps.execute();
            return "{\"OK\": \"Added Playlist.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
