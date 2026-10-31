import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffStatusDto } from './dto/update-staff-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async createStaff(@Body() dto: CreateStaffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get()
  async getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStaffStatusDto,
  ) {
    return this.staffService.updateStaffStatus(id, dto.isActive);
  }
}
