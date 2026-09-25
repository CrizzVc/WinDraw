export const reorderLayers = (list, dragId, targetId, placement) => {
    if (dragId === targetId) return list;
    const from = list.findIndex((l) => l.id === dragId);
    if (from === -1) return list;

    const next = list.slice();
    const [moved] = next.splice(from, 1);

    let to = next.findIndex((l) => l.id === targetId);
    if (to === -1) return list;
    if (placement === 'bottom') to += 1;

    next.splice(to, 0, moved);
    return next;
};
