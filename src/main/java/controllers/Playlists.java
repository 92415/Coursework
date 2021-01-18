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
    @POST
    @Path("delete/{PlaylistID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String DeleteResource(@PathParam("PlaylistID") Integer PlaylistID) throws Exception {
        System.out.println("Invoked Playlists.DeletePlaylist()");
        if (PlaylistID == null) {
            throw new Exception("PlaylistID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps2 = Main.db.prepareStatement("Delete FROM PlaylistTransfer WHERE PlaylistID = ? AND UserID = (SELECT UserID FROM Users WHERE Token IS NOT NULL)");
            ps2.setInt(1,PlaylistID);
            ps2.execute();
            PreparedStatement ps1 = Main.db.prepareStatement("DELETE FROM Playlists WHERE PlaylistID = ? AND UserID = (SELECT UserID FROM Users WHERE Token IS NOT NULL)");
            ps1.setInt(1, PlaylistID);
            ps1.execute();

            return "{\"OK\": \"Playlist deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
    @GET
    @Path("detail/{playlistID}/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String PlaylistList(@PathParam("playlistID") Integer PlaylistID) throws Exception {
        System.out.println("Invoked Playlists.PlaylistDetails()");
        if (PlaylistID == null) {
            throw new Exception("PlaylistID is missing in the HTTP request's URL.");
        }
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT PlaylistName, Description FROM Playlists WHERE UserID = (SELECT UserID FROM Users WHERE Token IS NOT NULL) AND PlaylistID = ?");
            ps.setInt(1, PlaylistID);
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("PlaylistName", results.getString(1));
                row.put("Description", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }
    @POST
    @Path("update/")
    public String PlaylistsUpdate(@FormDataParam("PlaylistID") Integer PlaylistID, @FormDataParam("PlaylistName") String PlaylistName, @FormDataParam("Description") String Description) {
        System.out.println("Invoked Playlists.PlaylistsUpdate()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Playlists SET PlaylistName = ?, Description = ? WHERE PlaylistID = ?");
            ps.setString(1, PlaylistName);
            ps.setString(2, Description);
            ps.setInt(3, PlaylistID);
            ps.execute();
            return "{\"OK\": \"Updated Playlist.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
