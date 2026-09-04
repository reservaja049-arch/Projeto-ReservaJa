import React, { useState, useEffect } from "react";
import { GoalShortcut, DEFAULT_GOAL_SHORTCUTS } from "../types";
import { formatCurrency } from "../utils";
import { Plus, Trash2, Settings, Check, X, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface GoalShortcutsProps {
  shortcuts?: GoalShortcut[];
  currency?: string;
  onSelectAmount: (amount: number) => void;
  onSaveShortcuts?: (newShortcuts: GoalShortcut[]) => void;
  currentAmount?: string;
}

export function GoalShortcuts({
  shortcuts,
  currency = "BRL",
  onSelectAmount,
  onSaveShortcuts,
  currentAmount,
}: GoalShortcutsProps) {
  const activeShortcuts =
    shortcuts && shortcuts.length > 0 ? shortcuts : DEFAULT_GOAL_SHORTCUTS;

  const [isEditing, setIsEditing] = useState(false);
  const [editedList, setEditedList] = useState<GoalShortcut[]>(activeShortcuts);

  useEffect(() => {
    setEditedList(
      shortcuts && shortcuts.length > 0 ? shortcuts : DEFAULT_GOAL_SHORTCUTS
    );
  }, [shortcuts]);

  const handleAddShortcut = () => {
    setEditedList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: "Novo Atalho",
        amount: 100,
      },
    ]);
  };

  const handleUpdateItem = (
    id: string,
    field: "name" | "amount",
    value: string
  ) => {
    setEditedList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "name") {
            return { ...item, name: value };
          } else {
            const num = parseFloat(value.replace(/,/g, ".")) || 0;
            return { ...item, amount: num };
          }
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setEditedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSaveShortcuts) {
      // Filter out shortcuts without name or invalid amount
      const cleaned = editedList
        .filter((item) => item.name.trim().length > 0 && item.amount > 0)
        .map((item) => ({ ...item, name: item.name.trim() }));
      onSaveShortcuts(cleaned.length > 0 ? cleaned : DEFAULT_GOAL_SHORTCUTS);
    }
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditedList(activeShortcuts);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-700/60 dark:bg-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          <span>Atalhos Rápidos de Valor</span>
        </div>

        {onSaveShortcuts && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) {
                handleCancel(e);
              } else {
                setEditedList(activeShortcuts);
                setIsEditing(true);
              }
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-200/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            title={isEditing ? "Cancelar edição" : "Editar atalhos de valor"}
          >
            {isEditing ? (
              <>
                <X className="h-3 w-3" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Settings className="h-3 w-3 text-gray-400" />
                <span>Editar nomes/valores</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Normal View: Chips */}
      {!isEditing ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          {activeShortcuts.map((shortcut) => {
            const isSelected =
              currentAmount &&
              parseFloat(currentAmount.replace(/,/g, ".")) === shortcut.amount;

            return (
              <button
                key={shortcut.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAmount(shortcut.amount);
                }}
                className={`flex flex-col items-start justify-center rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-500/30 dark:border-emerald-500 dark:bg-emerald-950/40"
                    : "border-gray-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-600 dark:hover:bg-gray-700/60"
                }`}
              >
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 line-clamp-1">
                  {shortcut.name}
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(shortcut.amount, currency)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Edit View: List of Editable Inputs */
        <div className="space-y-2.5">
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {editedList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "name", e.target.value)
                    }
                    placeholder="Nome do atalho"
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="w-28">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.amount || ""}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "amount", e.target.value)
                      }
                      placeholder="Valor"
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-emerald-600 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-emerald-400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                  title="Excluir atalho"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons in edit mode */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleAddShortcut}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Adicionar Atalho</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Salvar Atalhos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
