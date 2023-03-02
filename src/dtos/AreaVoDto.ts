import AreaVo from '@/models/valueObjects/AreaVo';

type AreaVoDto = {
  revealed: boolean;
  flagged: boolean;
  hasMine: boolean;
  adjMinesCount: number;
  boomed: boolean;
};

export function parseAreaVoDto(dto: AreaVoDto): AreaVo {
  return AreaVo.new(dto.revealed, dto.flagged, dto.hasMine, dto.adjMinesCount, dto.boomed);
}

export type { AreaVoDto };
