import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class DbformDto {

    @IsString()
  public dbname!: string; // Nombre de la base de datos
  @IsString()
  public datafilename!: string; // Ruta completa del archivo de datos (.mdf)
  @IsString()
  public logfilename!: string; // Ruta completa del archivo de log (.ldf)
  @Type(() => Number)
  @IsPositive()
  public datasizeMB!: number; // Tamaño inicial del archivo de datos (MB)
  @Type(() => Number)
  @IsPositive()
  public logsizeMB!: number; // Tamaño inicial del archivo de log (MB)
  @IsOptional()
  public datafilegrowthMB!: number | null; // Crecimiento del archivo de datos en MB (opcional)
  @IsOptional()
  public datafilegrowthPercent!: number | null; // Crecimiento del archivo de datos en porcentaje (opcional)
  @IsOptional()
  public logfilegrowthMB!: number | null; // Crecimiento del archivo de log en MB (opcional)
  @IsOptional()
  public logfilegrowthPercent!: number | null; // Crecimiento del archivo de log en porcentaje (opcional)
  @IsNumber()
  @IsPositive()
  public datamaxsizeMB!: number | null; // Tamaño máximo del archivo de datos (MB, null para ilimitado)
  @IsNumber()
  @IsPositive()
  public logmaxsizeMB!: number | null; // Tamaño máximo del archivo de log (MB, null para ilimitado)
}
