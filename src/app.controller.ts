/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clienteAdmBackend: ClientProxy;

  constructor() {
    this.clienteAdmBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto
  ) {
    this.clienteAdmBackend.emit('criar-categoria', criarCategoriaDto);
  }

  @Get('categorias')
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clienteAdmBackend.send('consultar-categorias', _id ? _id : '')
  }

  @Put('/categorias/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string
    ) {
      this.clienteAdmBackend.emit('atualizar-categoria', {id: _id, categoria: atualizarCategoriaDto})
    }

}
