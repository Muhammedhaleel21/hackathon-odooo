import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';
import { SubscriptionsService } from './subscriptions.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import {
  QuerySubscriptionDto,
  CloseSubscriptionDto,
} from './dto/query-subscription.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles('admin', 'staff')
  async create(
    @Body() dto: CreateQuotationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.createQuotation(dto, user);
  }

  @Get()
  @Roles('admin', 'staff', 'customer')
  async findAll(
    @Query() query: QuerySubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.findAll(query, user);
  }

  @Get(':id')
  @Roles('admin', 'staff', 'customer')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('admin', 'staff')
  async updateDraft(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.updateDraft(id, dto, user);
  }

  @Post(':id/issue')
  @Roles('admin', 'staff')
  async issue(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.issueQuotation(id, user);
  }

  @Post(':id/confirm')
  @Roles('admin', 'staff', 'customer')
  async confirm(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.confirmQuotation(id, user);
  }

  @Post(':id/activate')
  @Roles('admin', 'staff')
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.activateSubscription(id, user);
  }

  @Post(':id/close')
  @Roles('admin', 'staff')
  async close(
    @Param('id') id: string,
    @Body() dto: CloseSubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.closeSubscription(id, dto, user);
  }

  @Get(':id/history')
  @Roles('admin', 'staff', 'customer')
  async getHistory(@Param('id') id: string) {
    return this.subscriptionsService.getStatusHistory(id);
  }
}

