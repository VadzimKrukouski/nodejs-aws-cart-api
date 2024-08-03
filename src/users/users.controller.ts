import {Controller, Get, HttpStatus, Req} from "@nestjs/common";
import {UsersService} from "./services";
import {AppRequest, getUserIdFromRequest} from "../shared";

@Controller('api/profile/user')
export class UsersController {
    constructor(
        private userService: UsersService
    ) {
    }

    @Get()
    async findByUserId(@Req() req: AppRequest) {
        const user = await this.userService.findOne(getUserIdFromRequest(req));
        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: { user},
        }

    }

}