import { PlayerAgg } from '@/models/aggregates';
import { PositionVo, DirectionVo } from '@/models/valueObjects';
import { PositionVoDto } from './PositionVoDto';

type PlayerAggDto = {
  id: string;
  name: string;
  position: PositionVoDto;
  direction: 0 | 1 | 2 | 3;
};

export function parsePlayerAggDto(dto: PlayerAggDto): PlayerAgg {
  return PlayerAgg.new(
    dto.id,
    dto.name,
    PositionVo.new(dto.position.x, dto.position.z),
    DirectionVo.new(dto.direction)
  );
}

export type { PlayerAggDto };
