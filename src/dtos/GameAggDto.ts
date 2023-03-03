import { SizeVoDto } from './SizeVoDto';
import { AreaVoDto } from './AreaVoDto';
import { GameAgg } from '@/models/aggregates';
import { AreaVo, SizeVo } from '@/models/valueObjects';
import { mapMatrix } from '@/libs/common';

type GameAggDto = {
  id: string;
  size: SizeVoDto;
  minesCount: number;
  areas: AreaVoDto[][];
  camera: 0 | 1 | 2 | 3 | 4 | 5;
};

export function parseGameAggDto(dto: GameAggDto): GameAgg {
  return GameAgg.new(
    dto.id,
    SizeVo.new(dto.size.width, dto.size.height),
    dto.minesCount,
    mapMatrix(dto.areas, (areaDto) =>
      AreaVo.new(areaDto.revealed, areaDto.flagged, areaDto.hasMine, areaDto.adjMinesCount, areaDto.boomed)
    ),
    dto.camera
  );
}

export type { GameAggDto };
