package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("playlisttransfer/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class PlaylistTransfer{
    @GET
    @Path("list/{PlaylistID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String PlaylistTransferList(@PathParam("PlaylistID") Integer PlaylistID) throws Exception{
        System.out.println("Invoked PlaylistTransfer.PlaylistTransferList()");
        String Featured;
        JSONArray response = new JSONArray();
        if (PlaylistID == null) {
            throw new Exception("PlaylistID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Libraries.SongID, Libraries.SongName, Libraries.ArtistName, Libraries.FeatureName FROM Libraries INNER JOIN PlaylistTransfer ON Libraries.SongID = PlaylistTransfer.SongID WHERE (PlaylistTransfer.PlaylistID = ? AND PlaylistTransfer.UserID = (SELECT UserID From Users WHERE Token IS NOT NULL)) ORDER BY Libraries.SongName");
            ps.setInt(1, PlaylistID);
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
    public String PlaylistTransferAdd(@FormDataParam("SongID") Integer SongID, @FormDataParam("PlaylistID") Integer PlaylistID) {
        System.out.println("Invoked PlaylistTransfer.PlaylistTransferAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO PlaylistTransfer (SongID, PlaylistID, UserID) VALUES(?, ?, (SELECT UserID FROM Users WHERE Token IS NOT NULL))");
            ps.setInt(1, SongID);
            ps.setInt(2, PlaylistID);
            ps.execute();
            return "{\"OK\": \"Added Song.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
    @POST
    @Path("delete/")
    public String DeleteSong(@FormDataParam("SongID") Integer SongID, @FormDataParam("PlaylistID") Integer PlaylistID) {
        System.out.println("Invoked PlaylistTransfer.DeleteSong()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("Delete From PlaylistTransfer Where SongID = ? AND PlaylistID = ? AND UserID = (SELECT UserID FROM Users WHERE Token IS NOT NULL)");
            ps.setInt(1, SongID);
            ps.setInt(2, PlaylistID);
            ps.execute();
            return "{\"OK\": \"Song deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
    @GET
    @Path("unowned/{PlaylistID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String PlaylistTransferUnowned(@PathParam("PlaylistID") Integer PlaylistID) throws Exception{
        System.out.println("Invoked PlaylistTransfer.PlaylistTransferUnowned()");
        String Featured;
        JSONArray response = new JSONArray();
        if (PlaylistID == null) {
            throw new Exception("PlaylistID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT SongID, SongName, ArtistName, FeatureName FROM Libraries WHERE (SongID IN (SELECT SongID FROM Resources INNER JOIN Users ON Resources.UserID = Users.UserID WHERE Users.Token IS NOT NULL)) AND (SongID NOT IN (SELECT SongID FROM PlaylistTransfer WHERE PlaylistID = ?)) ORDER BY SongName");
            ps.setInt(1, PlaylistID);
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
}
