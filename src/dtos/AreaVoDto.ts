import AreaVo from '@/models/valueObjects/AreaVo';

type AreaVoDto = {
  revealed: boolean;
  flagged: boolean;
  hasMine: boolean;
  adjMinesCount: number;
};

export function parseAreaVoDto(dto: AreaVoDto): AreaVo {
  return AreaVo.new(dto.revealed, dto.flagged, dto.hasMine, dto.adjMinesCount);
}

export type { AreaVoDto };
