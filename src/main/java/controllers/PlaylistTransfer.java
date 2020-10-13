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
    @Path("list")
    public String PlaylistTransferList() {
        System.out.println("Invoked PlaylistTransfer.PlaylistTransferList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TransferID, ResourceID, PlaylistID FROM PlaylistTransfer");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("TransferID", results.getInt(1));
                row.put("ResourceID", results.getInt(2));
                row.put("PlaylistID", results.getInt(3));
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
    public String PlaylistTransferAdd(@FormDataParam("ResourceID") Integer ResourceID, @FormDataParam("PlaylistID") Integer PlaylistID, @FormDataParam("UserID") Integer UserID) {
        System.out.println("Invoked PlaylistTransfer.PlaylistTransferAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO PlaylistTransfer (ResourceID, PlaylistID, UserID) VALUES(?, ?, ?)");
            ps.setInt(1, ResourceID);
            ps.setInt(2, PlaylistID);
            ps.setInt(3, UserID);
            ps.execute();
            return "{\"OK\": \"Added Song.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
