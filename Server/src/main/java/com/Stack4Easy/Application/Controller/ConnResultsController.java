package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.Entity.ConnectionGames;
import com.Stack4Easy.Application.Entity.ConnectionResults;
import com.Stack4Easy.Application.Service.ConnGameService;
import com.Stack4Easy.Application.Service.ConnResultsService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class ConnResultsController {
    private final ConnResultsService connResultsService;
    private final ConnGameService connGameService;

    @PostMapping("/manage-player-icons")
    public ResponseEntity<ResponseModel> assignIcons(@RequestBody ConnectionResults connectionResults) {
        connResultsService.assignIcons(connectionResults);
        return ResponseEntity.ok(
                new ResponseModel(
                        "SENT",
                        200
                )
        );
    }

    @PostMapping("/manage-player-move/{Id}")
    public ResponseEntity<ResponseModel> saveMpve(@RequestBody ConnectionGames games, @PathVariable Integer Id){
        connGameService.saveMove(games, Id);
        return ResponseEntity.ok(
                new ResponseModel(
                        "PLACED",
                        200
                )
        );
    }
    @GetMapping("/manage-exit-game/{username}")
    public ResponseEntity<ResponseModel> exitGame(@PathVariable String username){
        connResultsService.exitGame(username);
        return ResponseEntity.ok(
                new ResponseModel(
                        "SUCCESS",
                        200
                )
        );
    }

    @PostMapping("/start-rematch")
    public ResponseEntity<ResponseModel> rematch(@RequestBody ConnectionResults connectionResults) {
        ResponseModel model = connResultsService.rematch(connectionResults);
        return ResponseEntity.ok(model);
    }

    @GetMapping("/manage-rematch-request/{username}/{opp}")
    public ResponseEntity<ResponseModel> sendRematchRequest(@PathVariable String username, @PathVariable String opp){
        ResponseModel model = connResultsService.sendRematchRequest(username, opp);
        return ResponseEntity.ok(model);
    }

    @GetMapping("/update-game-status/{gameId}/{userId}")
    public ResponseEntity<ResponseModel> updateGameStatus(
        @PathVariable Long gameId,
        @PathVariable Integer userId
    ){
        ResponseModel res = connResultsService.updateGameStatus(gameId, userId);
        return ResponseEntity.ok(res);
    }
}
